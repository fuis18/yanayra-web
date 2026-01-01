import { Controller, Post, Body } from '@nestjs/common';
import { PrinterService } from './printer.service';

@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post('print')
  async print(@Body() body: any) {
    console.log('BODY RECIBIDO ===>', body);
    return this.printerService.print(body?.content);
  }
}
