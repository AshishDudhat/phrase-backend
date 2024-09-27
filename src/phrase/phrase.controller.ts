import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { Phrase } from '../schemas/phrase.schema';

@Controller('api/phrases')
export class PhraseController {
    constructor(private readonly phraseService: PhraseService) {}

    @Post()
    async create(@Body() createPhraseDto: Partial<Phrase>): Promise<Phrase> {
        return this.phraseService.create(createPhraseDto);
    }

    @Get()
    async findAll(
        @Query('search') search: string,
        @Query('sortBy') sortBy: string,
        @Query('order') order: 'asc' | 'desc' = 'asc',
    ): Promise<Phrase[]> {
        return this.phraseService.findAll(search, sortBy, order);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Phrase> {
        return this.phraseService.findOne(id);
    }

    @Get(':id/:language')
    async getTranslation(@Param('id') id: string, @Param('language') language: string): Promise<string> {
        return this.phraseService.getTranslation(id, language);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePhraseDto: Partial<Phrase>): Promise<Phrase> {
        return this.phraseService.update(id, updatePhraseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Phrase> {
        return this.phraseService.delete(id);
    }
}