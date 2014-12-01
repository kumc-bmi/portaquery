#!/usr/bin/python
r'''Add plugin to i2b2 cell config

>>> txt = r"""
... // =====================...
... // THESE ARE ALL THE CELLS THAT ARE INSTALLED ONTO THE SERVER
... i2b2.hive.tempCellsList = [
...                 { code: "PM",
...                   forceLoading: true  // <----- this must be set ...
...                 },
...                 { code: "ONT"   },
...                 { code: "CRC"   },
...                 { code: "WORK"},
... //              { code: "SHRINE"},
...                 { code: "PLUGINMGR",
...                    forceLoading: true,
...                    forceConfigMsg: { params: [] }
...                 },
...         ];
... // ========...
... """

>>> pq = cell_config()
>>> result = edit(txt.split('\n'), pq)
>>> result.index('PortQuery'), result.index('tempCellsList')
(187, 101)

>>> result2 = edit(result.split('\n'), pq)
Traceback (most recent call last):
  ...
ValueError


'''

import json


def main(open_config):
    with open_config() as config:
        lines = config.readlines()
        try:
            result = edit(lines, cell_config())
        except ValueError:  # already there
            pass
        else:
            config.seek(0)
            config.write(result)


def cell_config(code='PortQuery',
                subdir='HERON'):
    return {
        'code': code,
        'forceLoading': True,
        'forceConfigMsg': {'params': []},
        'roles': ["DATA_LDS", "DATA_DEID", "DATA_PROT"],
        'forceDir': "cells/plugins/" + subdir
    }


def edit(lines,
         cell_info,
         target='i2b2.hive.tempCellsList = [',
         indent=4):

    # Is this plugin alread in there?
    if any(cell_info['code'] in line for line in lines):
        raise ValueError

    additions = (json.dumps(cell_info, indent=4)
                 + ',').split('\n')

    insert_point = (ix + 1
                    for (ix, line) in enumerate(lines)
                    if target in line).next()
    added = lines[:insert_point] + additions + lines[insert_point:]
    return '\n'.join(added)


if __name__ == '__main__':
    def _trusted_main():
        from sys import argv
        from __builtin__ import open as openf

        def open_config():
            path = argv[1]
            return openf(path, 'rwb')

        main(open_config)

    _trusted_main()
