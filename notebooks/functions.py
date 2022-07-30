## Constants

import pandas as pd
import os
import json

PKM_JSON_FILE = os.path.join(
    os.path.dirname(os.getcwd()), 
    "data",
    "builds",
    "pokemon",
    "pokemon-entries.json"
)

PKM_CSV_FILE = os.path.join(
    os.path.dirname(os.getcwd()), 
    "data",
    "builds",
    "pokemon",
    "pokemon-entries.csv"
)


## Functions
def load_json_datasource():
    file = open(PKM_JSON_FILE)
    raw_data = json.load(file)
    file.close()

    df_data = []

    for pkm in raw_data:
        stats = pkm['baseStats']
        newRow = {
            'id': pkm['id'],
            #'name': pkm['name'],
            #'form_name': pkm['formName'],
            'type1': pkm['type1'],
            'type2': pkm['type2'],
            'color': pkm['color'],
            
            'gen': pkm['generation'],
            'region': pkm['region'],
            'is_form': pkm['isForm'],
            'is_legendary': pkm['isLegendary'],
            'is_mythical': pkm['isMythical'],

            'hp': stats['hp'],
            'atk': stats['atk'],
            'def': stats['def'],
            'spatk': stats['spa'],
            'spdef': stats['spd'],
            'speed': stats['spe'],
            'bst': stats['hp'] + stats['atk'] + stats['def'] + stats['spa'] + stats['spd'] + stats['spe'],
            # TODO: data that would be interesting to add:
            # 'stage': pkm['stage'],
        }
        df_data.append(newRow)

    df = pd.DataFrame(df_data)
    df = df.set_index('id')
    
    return df

def cleanup_df(df):
    # Remove rows with negative stats (not released pokemon)
    df = df.query('hp > 0')

    # Normalize empty values
    df.loc[df['type2'].isna(), ['type2']] = pd.NA

    # Set missing color
    df.loc['floette-eternal', ['color']] = 'black'

    return df

# def load_csv_datasource():
#     df = pd.read_csv(PKM_CSV_FILE)
#     return df.set_index('id')

# def update_csv_datasource(df):
#     df.to_csv(PKM_CSV_FILE, encoding='utf-8', index=False)

def flatten_types(df):
    data = []
    for index, pkm in df.iterrows():
        newRow = {
            'id': index,
            'type': pkm['type1'],
            'type_slot': 1,
            'color': pkm['color'],
            
            'gen': pkm['gen'],
            'region': pkm['region'],
            'is_form': pkm['is_form'],

            'hp': pkm['hp'],
            'atk': pkm['atk'],
            'def': pkm['def'],
            'spatk': pkm['spatk'],
            'spdef': pkm['spdef'],
            'speed': pkm['speed'],
            'bst': pkm['bst']
        }
        
        data.append(newRow)
        
        if pkm['type2'] != None:
            newRow2 = newRow.copy()
            newRow2['type'] = pkm['type2']
            newRow2['type_slot'] = 2
            data.append(newRow2)
    
    return pd.DataFrame(data)