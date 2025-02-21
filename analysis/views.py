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
    tokens = lexer.analyze(source_code)

    # 4. Run Parsing
    defs = Definitions()
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

def generate_parse_tree_text(node, indent_level=0):
    """
    A helper function to build a string representation of the parse tree.
    """
    indent = "   " * indent_level
    node_str = f"{indent}{node.name}"
    if node.token:
        node_str += f" ({node.token.lexeme})"
    result = node_str + "\n"
    for child in node.children:
        result += generate_parse_tree_text(child, indent_level + 1)
    return result
