import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get(':id')
    async findOne(@Param('id') id: number, @I18n() i18n: I18nContext) {
        const Id = Number(id);
        const todo = await this.todoService.findOne(Id);
        if (!todo) {
            const message = i18n.translate('todo.not_found', { args: { id } });
            throw new NotFoundException(message);
        }
        return todo;
    }
}
