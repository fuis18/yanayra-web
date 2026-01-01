import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface PrinterGrpc {
  printText(data: { text: string }): any;
}

@Injectable()
export class PrinterService {
  private printerClient: PrinterGrpc;

  constructor(@Inject('PRINTER_PACKAGE') private grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.printerClient =
      this.grpcClient.getService<PrinterGrpc>('PrinterService');
  }

  async print(content: string) {
    try {
      const result = await firstValueFrom(
        this.printerClient.printText({ text: content }),
      );
      return result;
    } catch (error) {
      console.error('Error al imprimir:', error);
      return {
        success: false,
        message: 'Error comunicando con el microservicio Rust',
      };
    }
  }
}
