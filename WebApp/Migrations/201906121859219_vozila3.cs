namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vozila3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Vehicles", "Line_Id", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "Line_Id" });
            DropColumn("dbo.Vehicles", "Line_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Vehicles", "Line_Id", c => c.Int());
            CreateIndex("dbo.Vehicles", "Line_Id");
            AddForeignKey("dbo.Vehicles", "Line_Id", "dbo.Lines", "Id");
        }
    }
}
