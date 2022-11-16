import os
import argparse
import importlib
import shutil
import json
import jinja2
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

## VARS ##

cardsDefinitionFile = "cards.json"
templatePath = "templates/"
templateFile = templatePath + "card_template.svg"
imagesPath = "../../card-images/"
exportsPath = "exports/"
pngPath = exportsPath + "pngs/"
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
            cId = cardsFile['cards'][numCard]['id']
            cTitle = cardsFile['cards'][numCard]['title']
            cDescription = cardsFile['cards'][numCard]['description']
            cType = cardsFile['cards'][numCard]['type']
            
            checkImages(cId)

            cardTitle.append(cTitle)
            cardDescription.append(cDescription)
            cardType.append(cType)
            cardId.append(cId)
        return cardTitle, cardDescription, cardType, numberOfCards, cardId

def renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId):
    templateLoader = jinja2.FileSystemLoader(searchpath=".")
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = templateEnv.get_template(templateFile)

    for numCard in range(numberOfCards):
        imageFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".svg"
        pngFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".png"
        imageFilePath = svgsPath + imageFile
        pngFilePath = pngsPath + pngFile
        content = template.render(
            title = cardTitle[numCard],
            description = cardDescription[numCard],
            type = cardType[numCard],
            cId = cardId[numCard]
        )
<<<<<<< HEAD
        try: 
            with open(imageFilePath, mode="w", encoding="utf-8") as text:
                text.write(content)
                print("wrote..." + imageFilePath)
            #exportPdf(pdfFilePath,imageFilePath)
        except: 
            print("WARNING: Missing file " + imageFilePath + "!")
=======
        with open(imageFilePath, mode="w", encoding="utf-8") as text:
            text.write(content)
            print("wrote..." + imageFilePath)

        #exportPng(pngFilePath,imageFilePath)
>>>>>>> 32ea5b6 (changed pdf function for exporting pngs)

def checkImages(cardId):
    image = imagesPath + cardId + ".png"
    if os.path.exists(image):
        print("INFO: The image " + image + " is already present")
    else:
        print("WARNING: Missing " + image + "!")

def exportPng(pngFilePath,imageFilePath):
    print(imageFilePath)
    print(os.path.exists(imageFilePath))
    print(pngFilePath)

    options = '--batch-process --export-type=png'
    os.system('inkscape ' + imageFilePath + ' --export-filename=' + pngFilePath + ' ' + options)

def main(): 
    cardTitle, cardDescription, cardType, numberOfCards, cardId = getCards()
    renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId)

    
## END FUNCTIONS ##

## MAIN ##
if __name__=='__main__':
  main()
## END MAIN ##
