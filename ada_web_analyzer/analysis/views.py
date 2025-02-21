# analysis/views.py
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Import your modules
from Modules.LexicalAnalyzer import LexicalAnalyzer
from Modules.RDParser import RDParser
from Modules.Definitions import Definitions

def upload_code_view(request):
    """
    Render a page that lets users either upload a .ada file or paste code in a text area.
    """
    return render(request, 'analysis/upload_code.html')

@csrf_exempt
def process_code_view(request):
    """
    Handle POST requests with Ada source code:
      1. Tokenize the code
      2. Parse the tokens
      3. Return the results (tokens, parse tree, errors) as JSON or plain text
    """
    if request.method == 'POST':
        source_code = ""

        # 1. Check if user uploaded a file
        if 'ada_file' in request.FILES:
            uploaded_file = request.FILES['ada_file']
            source_code = uploaded_file.read().decode('utf-8')

        # 2. Or check if user pasted code
        elif 'ada_code' in request.POST:
            source_code = request.POST['ada_code']

        # 3. Use LexicalAnalyzer to get tokens
        lexer = LexicalAnalyzer(stop_on_error=False)
        tokens = lexer.analyze(source_code)

        # 4. Pass tokens to RDParser
        defs = Definitions()
        parser = RDParser(tokens, defs, stop_on_error=False, panic_mode_recover=False, build_parse_tree=True)
        success = parser.parse()

        # 5. Extract results: tokens, parse tree, errors
        tokens_list = [(t.token_type.name, t.lexeme) for t in tokens]
        errors_list = parser.errors + lexer.errors

        # 6. If parse tree is built, you can either return a textual representation
        parse_tree_text = ""
        if parser.parse_tree_root:
            parse_tree_text = generate_parse_tree_text(parser.parse_tree_root)

        # Return as JSON or render a template
        return JsonResponse({
            'tokens': tokens_list,
            'parse_tree': parse_tree_text,
            'errors': errors_list,
            'success': success,
        })

    return JsonResponse({'error': 'Only POST method allowed.'}, status=405)

def generate_parse_tree_text(node, indent_level=0):
    """
    A helper function to build a string representation of the parse tree.
    """
    indent = "   " * indent_level
    node_str = f"{indent}{node.name}"
    if node.token:
        node_str += f" ({node.token.lexeme})"
    tree_str = node_str + "\n"
    for child in node.children:
        tree_str += generate_parse_tree_text(child, indent_level + 1)
    return tree_str
