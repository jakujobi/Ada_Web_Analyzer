from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST
from Modules.LexicalAnalyzer import LexicalAnalyzer
from Modules.RDParser import RDParser
from Modules.Definitions import Definitions
import logging
import traceback

# Set up logging
logger = logging.getLogger(__name__)

@ensure_csrf_cookie
def upload_code_view(request):
    """
    Renders the main page with the upload form and code editor.
    Ensures a CSRF cookie is set for JavaScript requests.
    """
    logger.info(f"Rendering upload page for {request.META.get('REMOTE_ADDR')}")
    return render(request, 'analysis/upload_code.html')

@csrf_exempt
@require_POST
def process_code_view(request):
    """
    Receives code (via uploaded file or pasted text), runs lexical + syntax analysis,
    and returns JSON containing tokens, parse tree, and errors/logs.
    """
    try:
        logger.info(f"Processing code request from {request.META.get('REMOTE_ADDR')}")
        
        # Get code from the pasted text box
        source_code = request.POST.get('ada_code', '').strip()
        logger.info(f"Received code from text box: {len(source_code)} characters")
        
        # If no code in text box, try uploaded file
        if not source_code:
            uploaded_file = request.FILES.get('ada_file')
            if uploaded_file:
                source_code = uploaded_file.read().decode('utf-8')
                logger.info(f"Received code from file: {len(source_code)} characters, filename: {uploaded_file.name}")

        # If no code is provided, return an error.
        if not source_code:
            logger.warning("No code provided in request")
            return JsonResponse({
                'tokens': [],
                'parse_tree': '',
                'errors': ["No code provided."],
                'success': False,
            })

        # 3. Run Lexical Analysis
        logger.info("Starting lexical analysis")
        lexer = LexicalAnalyzer(stop_on_error=False)
        defs = Definitions()                           # Create a shared Definitions instance
        lexer.defs = defs                              # Use the same instance in lexer
        tokens = lexer.analyze(source_code)
        logger.info(f"Lexical analysis complete. Found {len(tokens)} tokens")

        # 4. Run Parsing using the same definitions instance
        logger.info("Starting parsing")
        parser = RDParser(tokens, defs, stop_on_error=False, panic_mode_recover=False, build_parse_tree=True)
        success = parser.parse()
        logger.info(f"Parsing complete. Success: {success}")

        # 5. Prepare results
        tokens_list = [(t.token_type.name, t.lexeme) for t in tokens]
        errors_list = lexer.errors + parser.errors  # combine lexical + parser errors
        logger.info(f"Found {len(errors_list)} errors")

        parse_tree_text = ""
        if parser.parse_tree_root:
            parse_tree_text = generate_parse_tree_text(parser.parse_tree_root)
            logger.info(f"Generated parse tree text: {len(parse_tree_text)} characters")

        return JsonResponse({
            'tokens': tokens_list,
            'parse_tree': parse_tree_text,
            'errors': errors_list,
            'success': success,
        })
    except Exception as e:
        logger.error(f"Error processing code: {str(e)}")
        logger.error(traceback.format_exc())
        return JsonResponse({
            'tokens': [],
            'parse_tree': '',
            'errors': [f"Server error: {str(e)}"],
            'success': False,
        }, status=500)

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
