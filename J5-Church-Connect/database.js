// J5 Church Connect Database


const churchDatabase = {

    users: [

    {
        id: "U001",
        username: "admin",
        password: "12345",
        role: "Admin",
        memberId: "J5-001"
    }
      ,
{
    id: "U002",
    username: "member",
    password: "12345",
    role: "Member",
    memberId: "J5-001"
},

{
    id: "U003",
    username: "pastor",
    password: "12345",
    role: "Pastor",
    memberId: "J5-001"
}

],

    members: [

    {
        id: "J5-001",
        name: "John Member",
        branch: "Harare Main Branch",
        ministry: "Worship Ministry",
        status: "Active"
    }

],

    branches: [],

    ministries: [],

    events: [],

    attendance: [],

    giving: [],

    prayerRequests: []

};


// Save database

function saveDatabase(){

    localStorage.setItem(
        "j5ChurchDatabase",
        JSON.stringify(churchDatabase)
    );

}


// Load database

function loadDatabase(){

    const savedData =
    localStorage.getItem("j5ChurchDatabase");


    if(savedData){

        return JSON.parse(savedData);

    }


    return churchDatabase;

}