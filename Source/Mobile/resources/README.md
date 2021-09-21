Most simplest and easiest way to do that is this package:

```npm install capacitor-resources```

1. Create the folder which is named resources under the root of your capacitor based project
2. Add your icon.png (1024x1024 px) and splash.png (2732x2732 px)
3. Add to your package.json a script definition:
```
{   
    ...   
    "scripts": {
        ...
        "resources": "capacitor-resources -p android,ios" 
    } 
}
npm run resources
```

* Note: Make sure that you have android, ios and www folders, if you don't have "ionic build & npx cap add android & npx cap add ios".

* Source: https://www.npmjs.com/package/capacitor-resources
