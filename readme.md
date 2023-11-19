
# API Spec
https://jkanesvapeapi.com

#### To validate store pin:
/v1/api/pin

    GET:
    storepin: string
RESPONSE

    {
        "success": true
    }
    
OR

    403 if not valid

#### To validate clerk code:
/v1/api/clerkcode

    GET:
    storepin: string
    clerkcode: string
RESPONSE

    {
        "success": true
    }
    
OR

    403 if not valid

#### ALL REQUESTS:
GET:

    storepin: string
    
OR

    403

Most pages can raise a 500 if the query failed
or 403 if clerk code is bad (on supported pages)    

### /v1/api/points
GET
    
    phone: string

RESPONSE

    {
        "id": 1,
        "name": "Collin",
        "phonenumber": "3529424136",
        "balance": 50,
        "__type": "Customer"
    }

OR

    404 for customer missing


### /v1/api/addpoints
GET

    clerkcode: string
    
POST

    customerid: int
    points: int

RESPONSE

    {
        "success": true
    }


### /v1/api/signup
POST

    phone:  string
    name:   string

RESPONSE

{
    "success": true
}

OR

    409 for existing customer


### /v1/api/sendmessage

GET

    clerkcode: string
    
POST:

    message: string
    
RESPONSE

    {
        "success": true
    }
