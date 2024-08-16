
using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.Models
{
    public class Products
    {
        public int id { get; set; }
        public required string name { get; set; }
        public required string description { get; set; }
        public required int price { get; set; }
        public required int amount { get; set; }
        public required string check { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}
