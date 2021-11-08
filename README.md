##  Description:
   - This project is a solution for managing contacts, where the application of CSV is done efficiently and several features are available.

##  Running BackEnd:
 - Running "yarn" in backend path .
 - Transform .env.example to .env
 - Run "docker-composer up" 
 - Run yan start:dev

##  Running automated tests 
 - Yarn test 
##  BackEnd features:
 - CSV processing in background
 - User creation
 - CSV upload
 - CSV Validation
 - User listing with paging
 - Contact listing with paging
 - health route
 - Integration test framework started with testcontainer
 - Unit test framework started
 - Upload Status Route
 - Status control by events
 - Use of worker threads
 - Authentication via JWT
 - login route
 - Deploy on Heroku
 - Used migration structure for better table management

## Notion 

On this link are the steps performed and will be included more documentation about the api:
 - https://unexpected-territory-205.notion.site/RFC-Contact-Import-API-f5bb5cdabe6c4489b9692272e8fa4b21


## Heroku:

you can check the api at the following Heroku link:

https://contact-import-api.herokuapp.com

Ex: https://contact-import-api.herokuapp.com/health
## Routes:

 ### POST /signup 
    - Request:

        ```json
        {
            "username": "example",
            "email": "example@email.com",
            "password": "example"
        }
        ```
 ### POST /signin
    - Request:

        ```json
        {
            "email": "example@example.com",
            "password": "example"
        }   
        ```

    - Response:

        ```json
        {
            "email": "example@example.com",
            "token": "Token"
        }  
        ```
        
 ### POST /upload
    - Request:
        multipart: file - file.csv 
        header: authorization - Bearer token

    - Response: 

    ```json
        {
        "status": "success",
            "data": {
                "operationId": "2e11b447-547f-4f21-91f7-9e4ef4832bc6"
            }
        }  
    ```
 ### GET /check-status/:operationId
    - Response:

    ```json
            {
                "status": "success",
                "data": {
                        "status": "Terminated",
                        "percent": 0
                }
            }     
    ```

 ### GET /contacts?items=2&page=1
    - Request - header: authorization - Bearer token

    - Response:

    ```json
            {
                "status": "success",
                "data": {
                    "items": [
                    {
                        "name": "Example",
                        "dateOfBirth": "2021 June 5",
                        "phone": "(+57) 320-432-05-09",
                        "creditCard": "***********8431",
                        "franchise": "amex",
                        "email": "example@example.com",
                        "address": "example"
                    },
                    {
                        "name": "Example",
                        "dateOfBirth": "2021 June 5",
                        "phone": "(+57) 320-432-05-09",
                        "creditCard": "***********8431",
                        "franchise": "amex",
                        "email": "example@example.com",
                        "address": "example"
                    }
                    ],
                    "totalItems": 18,
                    "pages": 9
                }
            }    
    ```

 ### GET /files?items=2&page=1
    - Request - header: authorization - Bearer token

    - Response: 

    ```json
            {
                "status": "success",
                "data": {
                    "items": [
                        {
                            "fileName": "file-example.csv",
                            "author": "example@example.com",
                            "errors": [],
                            "size": "214",
                            "status": "Terminated",
                            "started_at": "Monday, November 8th 2021, 4:04:24 am",
                            "finished_at": "Monday, November 8th 2021, 4:04:26 am"
                        }
                    ],
                    "totalItems": 1,
                    "pages": 1
                }
            }   
    ``` 

### GET /health

    - Response: 

    ```json
            {
                "appName": "contact-import-api",
                "appVersion": "1.0.0",
                "currentDateTime": "2021-11-08T08:55:40+00:00",
                "env": "stg",
                "nodeEnv": "stg",
                "dbStatus": "online",
                "port": "9714",
                "errors": [],
                "statusCode": 200
            }  
    ```    
        


