# Project

## Integration
Para lanzar una integración : `npm run integrate:dev <filename>`
El fichero tiene que estar en src/integration/<filename>.csv

### Datos aceptados:
El primer número de las línias representan el tipo de dato a integrar.
- 0 : cluster
- 1 : subcluster
- 2 : rating

#### Línias 0 (cluster)
`0,1,Atencion,"director,amabilidad"`

`<tipoLinia>,<label>,<words>`
- tipoLinia: integer
- label: string
- words: string de palabras separadas por coma 

#### Línia 1 (subcluster)
`1,1,Equipo,"empleado,persona",1`

`<tipoLinia>,<label>,<words>,<clusterId>`
- tipoLinia: integer
- label: string
- words: string de palabras separadas por coma 
- clusterId: integer, id del cluster asociado (tiene que existir en BDD o en el fichero)

#### Línia 2 (rating)
`2,3,"Este director muy antipatico","2020-10-17 01:09:12.797004",1.3,42.2,España,1,1`

`<tipoLinia>,<punctuation>,<comment>,<date>,<lat>,<lng>,<country>,<cluster_id>,<subcluster_id>`
- tipoLinia: integer
- punctuation: float
- comment: string 
- date: date
- lat: float
- lng: float
- country: string
- cluster_id: integer, id del cluster asociado (tiene que existir en BDD o en el fichero)
- subcluster_id: id del subcluster asociado (tiene que existir en BDD o en el fichero)
