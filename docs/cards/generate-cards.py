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
cardTemplateFile = templatePath + "card_template.svg"
clusterTemplateFile = templatePath + "cluster_template.svg"
printTemplateFile = templatePath + "print_template.svg"
imagesPath = "../../card-images/"
exportsPath = "exports/"
pngsPath = exportsPath + "pngs/"
svgsPath = exportsPath + "svgs/"
printSvgPath = exportsPath + "printsvgs/"
printPdfPath = exportsPath + "printpdfs/"
availableLabels = ["opensource","corporation","microservice","database","java"]

## END VARS ##

## FUNCTIONS ##

def getCards():
    cardTitle = []
    cardDescription = []
    cardType = []
    cardId = []
    cardColor = []
    cardLabels = []

    with open(cardsDefinitionFile, 'r') as cards:
        cardsFile = json.loads(cards.read())
        cardDeck = []
        for card in cardsFile["cards"]:
            for n in range(0,card["units"]):
                cardDeck.append(card)
        numberOfCards = len(cardDeck)
        print('INFO: Total number of cards found in ' + cardsDefinitionFile + ' : ' + str(numberOfCards))
        for numCard in range(numberOfCards):
            cId = cardDeck[numCard]['id']
            cTitle = cardDeck[numCard]['title']
            cDescription = cardDeck[numCard]['description']
            cType = cardDeck[numCard]['type']
            cColor = getCardColor(cType)
            if 'label' not in cardDeck[numCard].keys(): 
                cardDeck[numCard]['label'] = []
            cLabels = getLabelsColor(cardDeck[numCard]['label'])
            checkImages(cId)

            cardTitle.append(cTitle)
            cardDescription.append(cDescription)
            cardType.append(cType)
            cardId.append(cId)
            cardColor.append(cColor)
            cardLabels.append(cLabels)

        return cardTitle, cardDescription, cardType, numberOfCards, cardId, cardColor, cardLabels

def renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId, cardColor, cardLabels):
    pngFilesToPrint=[]
    for numCard in range(numberOfCards):
        templateLoader = jinja2.FileSystemLoader(searchpath=".")
        templateEnv = jinja2.Environment(loader=templateLoader)
        if cardType[numCard] == "cluster":
            template = templateEnv.get_template(clusterTemplateFile)
        else: 
            template = templateEnv.get_template(cardTemplateFile)

        imageFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".svg"
        pngFile = "card_" + str(cardId[numCard]) + "_" + str(numCard) + ".png"
        pngFilesToPrint.append(pngFile)
        imageFilePath = svgsPath + imageFile
        pngFilePath = pngsPath + pngFile
        
        content = template.render(
            title = cardTitle[numCard],
            description = cardDescription[numCard],
            type = cardType[numCard],
            cId = cardId[numCard],
            cColor = cardColor[numCard],
            cLabels = cardLabels[numCard]
        )
 
        with open(imageFilePath, mode="w", encoding="utf-8") as text:
            text.write(content)
            print("wrote..." + imageFilePath)
            
        exportPng(pngFilePath,imageFilePath)

    for index in range(0,len(pngFilesToPrint),8):
        templateLoader = jinja2.FileSystemLoader(searchpath=".")
        templateEnv = jinja2.Environment(loader=templateLoader)
        template = templateEnv.get_template(printTemplateFile)

        if len(pngFilesToPrint) < index + 7:
            for _ in range(0,index + 7 - len(pngFilesToPrint) +1):
                pngFilesToPrint.append("")
        content = template.render(
            image01 = pngFilesToPrint[index],
            image02 = pngFilesToPrint[index+1],
            image03 = pngFilesToPrint[index+2],
            image04 = pngFilesToPrint[index+3],
            image05 = pngFilesToPrint[index+4],
            image06 = pngFilesToPrint[index+5],
            image07 = pngFilesToPrint[index+6],
            image08 = pngFilesToPrint[index+7])

        printFileName = "print_" + str(index) + ".svg"
        with open(printSvgPath+printFileName, mode="w", encoding="utf-8") as text:
            text.write(content)
            print("wrote..." + printSvgPath+printFileName)
        #exportPdf(printPdfPath+"print_" + str(index) + ".pdf",printSvgPath+printFileName)

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

def exportPdf(pdfFilePath,imageFilePath):
    print(imageFilePath)
    print(os.path.exists(imageFilePath))
    print(pdfFilePath)

    options = '--batch-process --export-type=pdf'
    os.system('inkscape ' + imageFilePath + ' --export-filename=' + pdfFilePath + ' ' + options)

def getCardColor(cardType):
    if cardType == "celebrity":
        return "#989898"
    elif cardType == "defense":
        return "#1eb72a"
    elif cardType == "event":
        return "#8234a9"
    elif cardType == "offense":
        return "#b71e1e"
    else:
        return "#1e7ab7"

def getLabelsColor(labels):
    labelsOpacity = {} 
    for label in availableLabels:
        labelsOpacity[label] = 1 if label in labels else 0
    return labelsOpacity

def main(): 
    cardTitle, cardDescription, cardType, numberOfCards, cardId, cardColor, cardLabels = getCards()
    renderCards(cardTitle, cardDescription, cardType, numberOfCards, cardId,cardColor, cardLabels)

    
## END FUNCTIONS ##

## MAIN ##
if __name__=='__main__':
  main()
## END MAIN ##
