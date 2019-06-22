namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vozila : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Vehicles", "LineId", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "LineId" });
            RenameColumn(table: "dbo.Vehicles", name: "LineId", newName: "Line_Id");
            AlterColumn("dbo.Vehicles", "Line_Id", c => c.Int());
            CreateIndex("dbo.Vehicles", "Line_Id");
            AddForeignKey("dbo.Vehicles", "Line_Id", "dbo.Lines", "Id");
            DropColumn("dbo.Vehicles", "Longitude");
            DropColumn("dbo.Vehicles", "Latitude");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Vehicles", "Latitude", c => c.Double(nullable: false));
            AddColumn("dbo.Vehicles", "Longitude", c => c.Double(nullable: false));
            DropForeignKey("dbo.Vehicles", "Line_Id", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "Line_Id" });
            AlterColumn("dbo.Vehicles", "Line_Id", c => c.Int(nullable: false));
            RenameColumn(table: "dbo.Vehicles", name: "Line_Id", newName: "LineId");
            CreateIndex("dbo.Vehicles", "LineId");
            AddForeignKey("dbo.Vehicles", "LineId", "dbo.Lines", "Id", cascadeDelete: true);
        }
    }
}
