import { Test, TestingModule } from '@nestjs/testing';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import { Phrase } from '../schemas/phrase.schema';
import { NotFoundException } from '@nestjs/common';

describe('PhraseController', () => {
    let controller: PhraseController;
    let service: PhraseService;

    const mockPhraseService = {
        create: jest.fn((dto) => Promise.resolve({ _id: '1', ...dto })),
        findAll: jest.fn((search, sortBy, order) => Promise.resolve([{ _id: '1', phrase: 'Hello' }])),
        findOne: jest.fn((id) => Promise.resolve({ _id: id, phrase: 'Hello' })),
        update: jest.fn((id, dto) => Promise.resolve({ _id: id, ...dto })),
        delete: jest.fn((id) => Promise.resolve({ _id: id, phrase: 'Hello' })),
        getTranslation: jest.fn((id, language) => {
            if (language === 'fr') {
                return Promise.resolve('Bonjour');
            } else if (language === 'es') {
                return Promise.resolve('Hola');
            } else {
                return Promise.reject(new NotFoundException(`Translation not found for language: ${language}`));
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PhraseController],
            providers: [{ provide: PhraseService, useValue: mockPhraseService }],
        }).compile();

        controller = module.get<PhraseController>(PhraseController);
        service = module.get<PhraseService>(PhraseService);
    });

    describe('create', () => {
        it('should create a new phrase', async () => {
            const dto = { phrase: 'Hello', status: 'active', translations: { fr: 'Bonjour', es: 'Hola' } };
            expect(await controller.create(dto)).toEqual({ _id: '1', ...dto });
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return an array of phrases', async () => {
            const search = '';
            const sortBy = 'phrase';
            const order = 'asc';
            expect(await controller.findAll(search, sortBy, order)).toEqual([{ _id: '1', phrase: 'Hello' }]);
            expect(service.findAll).toHaveBeenCalledWith(search, sortBy, order);
        });
    });

    describe('findOne', () => {
        it('should return a single phrase by ID', async () => {
            const id = '1';
            expect(await controller.findOne(id)).toEqual({ _id: id, phrase: 'Hello' });
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update and return the phrase', async () => {
            const id = '1';
            const dto = { phrase: 'Updated Phrase' };
            expect(await controller.update(id, dto)).toEqual({ _id: id, ...dto });
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('delete', () => {
        it('should delete a phrase and return it', async () => {
            const id = '1';
            expect(await controller.delete(id)).toEqual({ _id: id, phrase: 'Hello' });
            expect(service.delete).toHaveBeenCalledWith(id);
        });
    });
    describe('getTranslation', () => {
        it('should return the French translation of a phrase', async () => {
            const id = '1';
            const language = 'fr';
            expect(await controller.getTranslation(id, language)).toEqual('Bonjour');
            expect(service.getTranslation).toHaveBeenCalledWith(id, language);
        });

        it('should return the Spanish translation of a phrase', async () => {
            const id = '1';
            const language = 'es';
            expect(await controller.getTranslation(id, language)).toEqual('Hola');
            expect(service.getTranslation).toHaveBeenCalledWith(id, language);
        });

        it('should throw NotFoundException for non-existing translation', async () => {
            const id = '1';
            const language = 'de'; // Assuming 'de' is not supported
            await expect(controller.getTranslation(id, language)).rejects.toThrow(NotFoundException);
            await expect(controller.getTranslation(id, language)).rejects.toThrow(`Translation not found for language: ${language}`);
        });
    });
});
