namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migracijaVozila : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Vehicles", "LineId", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "LineId" });
            AlterColumn("dbo.Vehicles", "LineId", c => c.Int());
            CreateIndex("dbo.Vehicles", "LineId");
            AddForeignKey("dbo.Vehicles", "LineId", "dbo.Lines", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vehicles", "LineId", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "LineId" });
            AlterColumn("dbo.Vehicles", "LineId", c => c.Int(nullable: false));
            CreateIndex("dbo.Vehicles", "LineId");
            AddForeignKey("dbo.Vehicles", "LineId", "dbo.Lines", "Id", cascadeDelete: true);
        }
    }
}
