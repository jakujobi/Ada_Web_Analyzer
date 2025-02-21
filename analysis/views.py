from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from Modules.LexicalAnalyzer import LexicalAnalyzer
from Modules.RDParser import RDParser
from Modules.Definitions import Definitions

def upload_code_view(request):
    """
    Renders the main page with the upload form and code editor.
    """
    return render(request, 'analysis/upload_code.html')

@csrf_exempt
@require_POST
def process_code_view(request):
    """
    Receives code (via uploaded file or pasted text), runs lexical + syntax analysis,
    and returns JSON containing tokens, parse tree, and errors/logs.
    """
    source_code = ""

    # 1. Check if user uploaded a file
    uploaded_file = request.FILES.get('ada_file')
    if uploaded_file:
        source_code = uploaded_file.read().decode('utf-8')

    # 2. Or check if user pasted code
    if not source_code:
        source_code = request.POST.get('ada_code', '')

    # 3. Run Lexical Analysis
    lexer = LexicalAnalyzer(stop_on_error=False)
    defs = Definitions()                           # Create a shared Definitions instance
    lexer.defs = defs                              # Use the same instance in lexer
    tokens = lexer.analyze(source_code)

    # 4. Run Parsing using the same definitions instance
    parser = RDParser(tokens, defs, stop_on_error=False, panic_mode_recover=False, build_parse_tree=True)
    success = parser.parse()

    # 5. Prepare results
    tokens_list = [(t.token_type.name, t.lexeme) for t in tokens]
    errors_list = lexer.errors + parser.errors  # combine lexical + parser errors

    parse_tree_text = ""
    if parser.parse_tree_root:
        parse_tree_text = generate_parse_tree_text(parser.parse_tree_root)

    return JsonResponse({
        'tokens': tokens_list,
        'parse_tree': parse_tree_text,
        'errors': errors_list,
        'success': success,
    })

def generate_parse_tree_text(node, prefix="", is_last=True):
    """
    Generates a string representation of the parse tree using Unicode connectors.
    """
    connector = "└──" if is_last else "├──"
    line = f"{prefix}{connector} {node.name}"
    if node.token:
        line += f" ({node.token.lexeme})"
    line += "\n"

    new_prefix = prefix + ("    " if is_last else "│   ")

    child_count = len(node.children)
    for i, child in enumerate(node.children):
        line += generate_parse_tree_text(child, new_prefix, i == (child_count - 1))

    return line

