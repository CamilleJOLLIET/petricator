# Petricator

Ce petit BOT Discord permet de consigner et de partager des données en lien avec le jeu MountyHall. Il facilite l'organisation et la communication au sein d'un groupe.

## Features

- Gestion des cibles prioritaires
- Gestion des consignes de groupe
- Gestion des missions

## Gestion des cibles

```javascript
/targets [show][add][delete][update][deleteAll]
```
Les cibles prioritaires sont composées à minima de l'ID du monstre (ou du troll), de son nom et de sa position. Une clé "détails" permet de rajouter des informations complémentaires comme les personnes concernées par la cible, le traitement qui lui ai reservé, etc...
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. ID de la cible |
| `name` | `string` | **Required**. Nom de la cible |
| `position` | `string` | **Required**. Position de la cible |
| `details` | `string` | Détails sur la stratégie |

## Gestion des consignes

```javascript
/instructions [show][add][delete][update][deleteAll]
```
Les consignes sont composées d'un encart pour le contenu et d'un encart détaillant les personnes concernées. Une date est générée automatiquement à chaque création ou mise à jour d'une consigne.
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `content` | `string` | **Required**. Contenu de la consigne |
| `usersConcerned` | `string` | Précisions sur les joueurs concernés |
| `date` | `string` | **Required**. Date générée à la création et à la mise à jour |

## Gestion des missions

```javascript
/missions [show][add][delete][update][deleteAll]
```
Les missions sont composées de l'ID de la mission, du propriétaire, du leader, de l'étape en cours et des membres recrutés.
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. ID de la mission |
| `owner` | `string` | **Required**. Propriétaire de la mission |
| `leader` | `string` | **Required**. Leader de la mission |
| `currentStep` | `string` | **Required**. Etape en cours |
| `members` | `string` | Membres recrutés |


### TODO

SPOTS ?

### OK

* TARGETS show/add/delete/update/deleteAll 👍
* INSTRUCTIONS show/add/delete/update/deleteAll 👍
* MISSIONS show/add/delete/update/deleteAll 👍

### EN COURS

### Consignes de dev et de déploiement
npm run build avant de push
npm run dev pour clean les commands obsolètes puis pour dev