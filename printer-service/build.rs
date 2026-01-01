use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../proto");

    tonic_build::configure()
        .out_dir("src/proto")
        .compile_protos(&[proto_dir.join("printer.proto")], &[proto_dir])?;

    Ok(())
}
