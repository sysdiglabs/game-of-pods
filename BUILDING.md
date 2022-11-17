# How to add or edit cards?
You can edit the cards in [this file](/docs/cards/cards.json).

After editing the file, you can generate the images in the `/docs/cards/exports/` folder doing: 

```
cd docs/cards
python3 generate-cards.py
```

You will find the SVGs of the print A4 version in `/docs/cards/exports/printsvgs/`. Finally, you just have to convert these SVG files to PDF. To do that, you can use Inkscape, for example.