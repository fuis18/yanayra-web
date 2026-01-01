import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRINTER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'printer',
          protoPath: join(__dirname, '../../../proto/printer.proto'),
          url: 'localhost:50051',
          // Usar con docker
          // url: 'printer-service:50051',
        },
      },
    ]),
  ],
  controllers: [PrinterController],
  providers: [PrinterService],
})
export class PrinterModule {}
