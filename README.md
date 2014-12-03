# portaquery -- migrate an query between i2b2 sites

by Dan Connolly  
University of Kansas Medical Center, [Division of Informatics][1]

[1]: https://informatics.kumc.edu/

## PortQuery user directions

   1. In the other i2b2:
       1. Run a query.
           - Make sure debug mode is on: look for the Show XML Message
 Stack button: <>, especially in the top right Query Tool section.
       2. Open the XML Message Stack and find the
 runQueryInstance_fromQueryDefinition message for your query (recent
 messages are at the bottom of the list)
       3. Copy the query_definition element, including its tags.
   2. Then, in this i2b2,
      1. Paste below.
      2. Hit Load Query below.
      3. Select the Find Patients tab to see your query.


## Installation

Installation follows the [i2b2 plug-in install/register][2] model.

[2]: https://community.i2b2.org/wiki/display/webclient/Web+Client+Plug-in+Developers+Guide

The `deploy/add_to_site.py` script can help:

```
$ webclient=...htdocs/i2b2/webclient  
$ plugins=${webclient}/js-i2b2/cells/plugins  
$ mkdir -p ${plugins}/HERON  
$ unzip -q -o -d ${plugins}/HERON/PortQuery/ portaquery.zip  
$ python ${plugins}/WIP/PortQuery/deploy/add_to_cell.py PortQuery ${webclient}/js-i2b2/i2b2_loader.js
```

## Source Code Repository

See [portaquery][] on bitbucket.

[portaquery]: https://bitbucket.org/DanC/portaquery


## Share and Enjoy

MIT license. See LICENSE file for details.


## Acknowedgements

This project is supported by PCORI contract CDRN-1306-04631.


## References

 * Waitman, L. R., Aaronson, L. S., Nadkarni, P. M., Connolly, D. W. &
   Campbell, J. R. The Greater Plains Collaborative: a PCORnet
   Clinical Research Data Network. J Am Med Inform Assoc 21, 637-641
   (2014).

 * [PortQuery][]

[PortQuery]: https://informatics.gpcnetwork.org/trac/Project/wiki/PortQuery

 * Waitman LR, Warren JJ, Manos EL, Connolly DW.  Expressing
   Observations from Electronic Medical Record Flowsheets in an i2b2
   based Clinical Data Repository to Support Research and Quality
   Improvement. AMIA Annu Symp Proc. 2011;2011:1454-63. Epub 2011 Oct
   22.

 * [HERON][]

[HERON]: https://informatics.kumc.edu/work/wiki/HERON
