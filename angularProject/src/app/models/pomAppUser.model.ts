export class PomAppUserModel{
    Id: string;
    Name: string;
    LastName: string;
    Email: string;
    Street: string;
    Number: string;
    City: string;
    Birthaday: string;
    Image: string;
    AddressId: number;
    //Password: string
   
    constructor(id:string,
        name:string, 
        lastName:string,
         email:string, 
        street: string, 
        number:string, 
        city:string, 
        birthday:string, 
        addressId:number){
            this.Id = id;
            this.Name = name;
            this.LastName = lastName;
            this.Email = email;
            this.Street = street;
            this.Number = number;
            this.City = city;
            this.Birthaday = birthday;
            //this.Image = image;
            this.AddressId = addressId;
            //this.Password = password;
            
    }
}