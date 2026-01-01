use std::io::Write;
use std::net::TcpStream;
use tonic::{transport::Server, Request, Response, Status};

pub mod proto;
use proto::printer::printer_service_server::{PrinterService, PrinterServiceServer};
use proto::printer::{PrintRequest, PrintResponse};

use encoding::all::WINDOWS_1252;
use encoding::{EncoderTrap, Encoding};

#[derive(Debug, Default)]
pub struct MyPrinterService;
#[tonic::async_trait]
impl PrinterService for MyPrinterService {
    async fn print_text(
        &self,
        request: Request<PrintRequest>,
    ) -> Result<Response<PrintResponse>, Status> {
        let text = request.into_inner().text;
        println!("Recibiendo solicitud de impresión: {}", text); // Intentar conectar con la impresora
        match TcpStream::connect("192.168.0.252:9100") {
            Ok(mut stream) => {
                let saltos = "\r\n".repeat(10);

                // ESC/POS
                let init = b"\x1B\x40"; // reset
                let charset = b"\x1B\x74\x10"; // WINDOWS-1252 ⬅️ CLAVE
                let margen = b"\x1D\x4C\x18\x00"; // margen izquierdo
                let grande = b"\x1D\x21\x11"; // letra grande

                // UTF-8 → WINDOWS-1252
                let encoded_text = WINDOWS_1252.encode(&text, EncoderTrap::Replace).unwrap();

                let mut data = Vec::new();
                data.extend_from_slice(init);
                data.extend_from_slice(charset);
                data.extend_from_slice(margen);
                data.extend_from_slice(grande);
                data.extend_from_slice(&encoded_text);
                data.extend_from_slice(saltos.as_bytes());

                stream
                    .write_all(&data)
                    .map_err(|e| Status::internal(e.to_string()))?;

                Ok(Response::new(PrintResponse {
                    success: true,
                    message: "Texto impreso correctamente".to_string(),
                }))
            }

            Err(e) => {
                eprintln!("Error al conectar con la impresora: {}", e);
                Ok(Response::new(PrintResponse {
                    success: false,
                    message: format!("Error de conexión: {}", e),
                }))
            }
        }
    }
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::]:50051".parse()?;
    let printer_service = MyPrinterService::default();
    println!("Servidor gRPC escuchando en {}", addr);
    Server::builder()
        .add_service(PrinterServiceServer::new(printer_service))
        .serve(addr)
        .await?;
    Ok(())
}
