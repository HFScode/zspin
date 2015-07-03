# zspin
<a href="README.md">English version</a>    

zspin est un frontend pour jeux, qui fonctionne sur windows, linux et OSX.    
C'est du logiciel en beta alors attention aux bugs !    
N'hesitez pas a ouvrir une issue ou m'envoyer une PR !

// sshot

## Specifications actuelles

* Compatible OSX, Linux, Windows
* Gestion des themes et preferences d'hyperspin (basique)
* Support des themes HTML
* Auto redimensionnement des themes (1080p et au dela)
* Lancement par launcher personnalisable
* Support des claviers / gamepads / joysticks en natif
* Wheels complètement customizables
* Ecran d'options
* Assistant de premier démarrage / configuration

## Installation
<a href="https://github.com/vikbez/zspin-gui/releases">Aller aux telechargements.</a>

## Specifications du futur

* Meilleur support des themes
* Trucs cooperatifs ? (qui joue a quoi)
* Configuration par le reseau ?
* Si vous avez une idee dites le moi !

## Pour developper
### OSX

```bash
# si vous utilisez macports adaptez cette ligne
$> brew install nodejs npm

# installer & compiler l'application
$> make

# (optionnel) utiliser livereload et compiler
$> make watch

# lancer zspin
$> make run

# si vous voulez preparer une archive
$> make release
```

## License

zspin est sous license <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

Si vous voulez vendre du materiel avec zspin installé dessus (utilisation commerciale), <a href="mailto:v@42.am?subject=Je+veux+une+license+!">Contactez moi</a> ! Je vous fournirais une license pour ca.
