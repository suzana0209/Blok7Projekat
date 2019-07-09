namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PayPalModelMigracija : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PayPalModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PayementId = c.String(),
                        PayerEmail = c.String(),
                        PayerName = c.String(),
                        PayerSurname = c.String(),
                        CreateTime = c.DateTime(),
                        CurrencyCode = c.String(),
                        Status = c.String(),
                        Value = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Tickets", "PayPalModelId", c => c.Int(nullable: false));
            CreateIndex("dbo.Tickets", "PayPalModelId");
            AddForeignKey("dbo.Tickets", "PayPalModelId", "dbo.PayPalModels", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tickets", "PayPalModelId", "dbo.PayPalModels");
            DropIndex("dbo.Tickets", new[] { "PayPalModelId" });
            DropColumn("dbo.Tickets", "PayPalModelId");
            DropTable("dbo.PayPalModels");
        }
    }
}
