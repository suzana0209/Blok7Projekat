namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class novaNova : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Tickets", name: "TypeOfTicket_Id", newName: "TypeOfTicketId");
            RenameIndex(table: "dbo.Tickets", name: "IX_TypeOfTicket_Id", newName: "IX_TypeOfTicketId");
            AddColumn("dbo.Tickets", "Email", c => c.String());
            AddColumn("dbo.Tickets", "PurchaseDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tickets", "PurchaseDate");
            DropColumn("dbo.Tickets", "Email");
            RenameIndex(table: "dbo.Tickets", name: "IX_TypeOfTicketId", newName: "IX_TypeOfTicket_Id");
            RenameColumn(table: "dbo.Tickets", name: "TypeOfTicketId", newName: "TypeOfTicket_Id");
        }
    }
}
