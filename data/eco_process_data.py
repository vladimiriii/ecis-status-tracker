# -*- coding: utf-8 -*-
import numpy
import pandas as pd
import json

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.integer):
            return int(obj)
        elif isinstance(obj, numpy.floating):
            return float(obj)
        elif isinstance(obj, numpy.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

file_path = "./economic_data.xlsx"
tabs = pd.ExcelFile(file_path).sheet_names

data_dict = {}
for tab in tabs:
    data = pd.read_excel(io=file_path, sheetname=tab, header=0, index_col=0)
    #data.index = data.iloc[:,0].apply(str)
    table_dict = data.to_dict()
    data_dict[tab] = table_dict

file_path = 'economic_data.js'
with open(file_path, 'w') as data_file:
    data_file.write("function getEcoData() {return "
                     + json.dumps(obj = data_dict, indent = 4, sort_keys=True, cls=MyEncoder)
                     + "}")