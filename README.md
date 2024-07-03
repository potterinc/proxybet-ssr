# ProxyBET Sport betting API

Folder Structure Conventions
============================

> Folder structure and naming conventions to be followed
 
     |––Project root							
     |–– src								
     |	|–– config					
     |	|	|- *.config.ts			
     |	|–– interfaces					 
     |	|	|- *.interface.ts				
     |	|–– middlewares						
     |	|	|- *.middleware.ts				
     |	|–– models							
     |	|	|- *.model.ts					
     |	|–– routes							
     |	|	|- *.routes.ts					
     |	|–– controllers						
     |	|	|- *.controllers.ts				
     |	|–– repository						
     |	|	|- *.repository.ts				
     |	|–– services						
     |	|	|–– third-party-services			
     |	|	|	|- *.service.ts				
     |	|	|- *.service.ts									
     |	|–– utils						
     |	|	|- *.utils.ts	
     |	|-app.ts							
     |–– test								
     |	|- *.test.ts						
     |-package-lock.json						
     |-package.json							
     |-tsconfig.json							
     |-README.md								


### Source Folder

 The actual source files of a software project are usually stored inside the `src` folder. Every file on this folder is continually watched for changed by the installed development dependencies which includes: `typescript, nodemon, jest, supertest`.

### Automated tests

Automated tests are usually placed into the `test` folder. This folder is also structured in a such a way that, every service and test cases per service or functionality is saved in their own directory. The testing library used for this project is `jest and supertest`. The essense of `supertest` framework is to be able to make `http` request during mocking.

> **Q: Why tests are placed into a separate folder, as opposed to having them closer to the code under test?**
>
> **A:** Because you don't want to test the code, you want to test the *program*.

### Model
 This directory contains the mongoose database schema for each collection. From the model we define the shape of the collection and database schema for the particular business logic. The naming convention for all models are maintained across the code base following this convention `schema.model.ts`

### Controller
....

### Routes

...

### Interfaces
 The interfaces contains the files that defines the shape of the models. It is recommended by TypeScript whenever data is being transported from one module to another either over `http` or within modules, it is recommended by Typescript to always define and interface for it. Just the same way you should annotate the types in all containers while using TypeScript. It is also recommended to following the naming convention across the codebase for interfaces in this format `schema.interface.ts` 

### Services
...

### Middlewares
....

### Config
...

### Tools and utilities

...

### 3rd party services

...

### License information
...
