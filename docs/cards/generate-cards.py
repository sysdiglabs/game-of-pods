import os
import argparse
import importlib
import shutil
from jinja2 import Environment, PackageLoader, select_autoescape

## VARS ##

cardsDefinitionFile = "cards.json"

## END VARS ##

## FUNCTIONS ##

def getCards():
    with open(cardsDefinitionFile, 'r') as cards:
        


def main():
    parser=argparse.ArgumentParser(
        description='Renders cards from the cards.json definition.'
    )
    parser.add_argument(

    )

    try:
        args=parser.parse_args()
    except:
        parser.print_help()
        exit(1)
    
## END FUNCTIONS ##

## MAIN ##
if __name__=='__main__':
  main()
## END MAIN ##
