import os
import argparse
import importlib
import shutil
import json
import jinja2
from fpdf import FPDF

## VARS ##

cardsDefinitionFile = "cards.json"
templatePath = "templates/"
templateFile = templatePath + "cards-template.md"
imagesPath = "../../card-images/"
exportsPath = "exports/"
pdfsPath = exportsPath + "pdfs/"
svgsPath = exportsPath + "svgs/"

## END VARS ##

## FUNCTIONS ##

def getCards():
    cardTitle = []
    cardDescription = []
    cardType = []
    cardId = []

    with open(cardsDefinitionFile, 'r') as cards:
        cardsFile = json.loads(cards.read())
        numberOfCards = len(cardsFile['cards'])
        print('INFO: Total number of cards found in ' + cardsDefinitionFile + ' : ' + str(numberOfCards))
        for numCard in range(numberOfCards):
            id = cardsFile['cards'][numCard]['id']
            cTitle = cardsFile['cards'][numCard]['title']
            cDescription = cardsFile['cards'][numCard]['description']
            cType = cardsFile['cards'][numCard]['type']
            
            checkImages(id)

            cardTitle.append(cTitle)
            cardDescription.append(cDescription)
            cardType.append(cType)
            cardId.append(id)
        return cardTitle, cardDescription, cardType, numberOfCards, cardId

def renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId):
    templateLoader = jinja2.FileSystemLoader(searchpath=".")
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = templateEnv.get_template(templateFile)

    for numCard in range(numberOfCards):
        imageFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".svg"
        pdfFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".pdf"
        imageFilePath = svgsPath + imageFile
        pdfFilePath = pdfsPath + pdfFile
        content = template.render(
            title = cardTitle[numCard],
            description = cardDescription[numCard],
            type = cardType[numCard]
        )
        with open(imageFilePath, mode="w", encoding="utf-8") as text:
            text.write(content)
            print("wrote..." + imageFilePath)

        exportPdf(pdfFilePath,imageFilePath)

def checkImages(cardId):
    image = imagesPath + cardId + ".png"
    if os.path.exists(image):
        print("INFO: The image " + image + " is already present")
    else:
        print("WARNING: Missing " + image + "!")

def exportPdf(pdfFilePath,imageFilePath): 
    pdf = FPDF()
    pdf.add_page()
    pdf.image(imageFilePath)
    pdf.output(pdfFilePath,'F')

def main(): 
    cardTitle, cardDescription, cardType, numberOfCards, cardId = getCards()
    renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId)

    
## END FUNCTIONS ##

## MAIN ##
if __name__=='__main__':
  main()
## END MAIN ##
