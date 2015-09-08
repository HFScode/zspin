![Logo zspin](assets/256.png)
# Zspin
### <a href="README.md">English version</a>    

zspin est un frontend pour jeux d'arcade, qui fonctionne sur windows, linux et OSX.    
C'est en beta alors attention aux bugs !    
N'hesitez pas a ouvrir une issue ou m'envoyer une PR !

![Image zspin](http://zspin.vik.io/static/zspin-small.gif)

## Specifications actuelles

* Compatible OSX, Linux, Windows
* Gestion des themes et preferences d'hyperspin (basique)
* Support des themes HTML5
* Support multilanguage
* Auto redimensionnement des themes (1080p et au dela)
* Lancement par launcher personnalisable
* Support des claviers / gamepads / joysticks en natif
* Wheels complètement customizables
* Ecran d'options
* Assistant de premier démarrage / configuration
* Application au lancement / a la sortie
* API basique

## Installation
<a href="https://github.com/vikbez/zspin-gui/releases">Aller aux telechargements.</a>

## Specifications du futur

* Meilleur support des themes
* Trucs cooperatifs ? (qui joue a quoi)
* Configuration par le reseau ?
* Si vous avez une idee dites le moi !

## Aider au projet
Il y a plein de choses que vous pouvez faire et qui aident BEAUCOUP:

* Documentation
* Traductions
* Tester / decrire les bugs
* Trouver quoi ajouter a cette liste

## Pour developper
### OSX

```bash
# pour les utilisateurs de brew
$> brew install nodejs npm

# installer & compiler l'application
$> make install

# (optionnel) utiliser livereload et compiler
$> gulp watch # -d pour le debug

# lancer zspin
$> gulp run

# si vous voulez generer une version
$> gulp release -p [platforme] # -d pour le debug
```

## License

zspin est sous license <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

Si vous voulez vendre du materiel avec zspin installé dessus (utilisation commerciale), <a href="mailto:v@42.am?subject=Je+veux+une+license+!">Contactez moi</a> ! Je vous fournirais une license pour ca.
