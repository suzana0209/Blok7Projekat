namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vozila2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vehicles", "TypeOfVehicle", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Vehicles", "TypeOfVehicle");
        }
    }
}
