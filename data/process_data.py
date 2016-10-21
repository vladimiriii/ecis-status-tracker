# -*- coding: utf-8 -*-
import pandas as pd
import json

file_path = "./indicator_data.xlsx"
tabs = pd.ExcelFile(file_path).sheet_names

data_dict = {}
for tab in tabs:
    data = pd.read_excel(io=file_path, sheetname=tab, header=0, index_col=0)
    #data.index = data.iloc[:,0].apply(str)
    table_dict = data.to_dict()
    data_dict[tab] = table_dict

file_path = 'data.js'
with open(file_path, 'w') as data_file:
    data_file.write("function getData() {return "
                     + json.dumps(obj = data_dict, indent = 4, sort_keys=True)
                     + "}")