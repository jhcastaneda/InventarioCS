using InventarioAPI.Data;
using InventarioAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly InventoryDB _context;

        public ProductController(InventoryDB context)
        {
            _context = context;
        }

        //Creacion de Productos
        [HttpPost]
        [Route("create")]
        public IActionResult CreateProduct([FromBody] Products product)
        {
            try
            {
                // Llamar a la función almacenada en PostgreSQL
                _context.Database.ExecuteSqlRaw("SELECT createproduct({0}, {1}, {2}, {3}, {4})",
                    product.name, product.description, product.price, product.amount, product.check);

                return Ok("Producto Creado son exito.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al crear el producto: {ex.Message}");
            }
        }

        //Edicion de Productos
        [HttpPut]
        [Route("edit/{id}")]
        public IActionResult EditProduct(int id, [FromBody] Products product)
        {
            try
            {
                // Verificar si el producto existe
                var existingProduct = _context.Products.Find(id);

                if (existingProduct == null)
                {
                    return NotFound($"Producto con ID {id} no existe.");
                }

                // Llamar a la función almacenada en PostgreSQL para editar el producto
                _context.Database.ExecuteSqlRaw("SELECT editproduct({0}, {1}, {2}, {3}, {4}, {5})",
                    id, product.name, product.description, product.price, product.amount, product.check);

                return Ok("Producto Editado con éxito.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al editar el producto: {ex.Message}");
            }
        }

        //Ver todos los datos de productos
        [HttpGet]
        [Route("getAll")]
        public IActionResult GetAllProducts()
        {
            try
            {
                //Lista todo los productos
                var products = _context.Products.ToList();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener todos los productos: {ex.Message}");
            }
        }

        
        // Obtener detalles de un producto por ID
        [HttpGet]
        [Route("getById/{id}")]
        public IActionResult GetProductById(int id)
        {
            try
            {
                var product = _context.Products.Find(id);

                if (product == null)
                {
                    return NotFound($"Producto con ID {id} no encontrado");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener detalles del producto: {ex.Message}");
            }
        }

        // Obtener el conteo global de entradas y salidas
        [HttpGet]
        [Route("getGlobalInventario")]
        public IActionResult GetGlobalEntryExitCount()
        {
            try
            {
                // Obtener el conteo global de entradas y salidas
                var entrada = _context.Products.Count(p => p.check == "Entrada");
                var salida= _context.Products.Count(p => p.check == "Salida");

                return Ok(new { Entrada = entrada, Salida= salida });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error al obtener el conteo global de entradas y salidas: {ex.Message}");
            }
        }

    }
}
