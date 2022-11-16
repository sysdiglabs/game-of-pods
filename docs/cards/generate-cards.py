import os
import argparse
import importlib
import shutil
import json
from jinja2 import Environment, PackageLoader, select_autoescape

## VARS ##

cardsDefinitionFile = "cards.json"
templatePath = "./templates"

## END VARS ##

## FUNCTIONS ##

def getCards():
    with open(cardsDefinitionFile, 'r') as cards:
        cardsFile = json.loads(cards.read())
        numberOfCards = len(cardsFile['cards'])
        # Test number of cards
        print('INFO: Total number of cards found in ' + cardsDefinitionFile + ' : ' + str(numberOfCards))
        for numCard in range(numberOfCards):
            id = cardsFile['cards'][numCard]['id']
            #print(id)
            cardTitle = cardsFile['cards'][numCard]['title']
            cardDescription = cardsFile['cards'][numCard]['description']
            cardType = cardsFile['cards'][numCard]['type']
            print(cardTitle)
            print(cardDescription)
            print(cardType)

def renderCards():
    templateEngine = Environment(loader=PackageLoader('templates', args.templatePath), autoescape=select_autoescape())


def main():

#    parser=argparse.ArgumentParser(
#        description='Renders cards from the cards.json definition.'
#    )
#    parser.add_argument(
#
#    )
#
#    try:
#        args=parser.parse_args()
#    except:
#        parser.print_help()
#        exit(1)

    getCards()

    
## END FUNCTIONS ##

## MAIN ##
if __name__=='__main__':
  main()
## END MAIN ##
