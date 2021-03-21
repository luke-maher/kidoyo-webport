# Kidoyo Webport
Import python mini projects into each other

# Installation
1. Download [Resource Override](https://chrome.google.com/webstore/detail/resource-override/pkoacgokdfckfpndoffpifphamojphii?hl=en) from the chrome web store, there is a version for firefox aswell
2. Open up the rule screen by clicking on the extension icon, then click add rule and then URL=>URL
3. In the from section put in `*https://pythonmini.app.oyoclass.com/static/plugins/skulpt/skulpt-stdlib.min.js*` and in the to section put in `https://cdn.jsdelivr.net/gh/luke-maher/kidoyo-webport@main/skulpt-stdlib.min.js`

![](https://i.imgur.com/TL9Dg1q.png "Title")

# Usage
1. In your python mini project add `import webport as w`
2. The add the function `w.webport(project_id, import_name)` where `project_id` is the id of the python mini project your trying to import and `import_name` is what you want the name of the import to be

# Sample

```python
import webport as w
w.webport("5f46af340375bb34958bce2e", "test") # Imports a file where the only line is 'a = 1'

print(test.a) # Outputs 1
```
