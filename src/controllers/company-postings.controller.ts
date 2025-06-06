import { Request, Response } from 'express';
import { CompanyPostingsService } from '../services/company-postings.service';

export class CompanyPostingsController {
    constructor(private readonly companyPostingsService: CompanyPostingsService) { }
    
    get = async (req: Request, res: Response) => {
        try {
            const { equipmentType, fullPartial } = req.query;
            const postings = await this.companyPostingsService.getCompanyPostings(
                equipmentType as string,
                fullPartial as string
            );
            res.json(postings);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    post = async (req: Request, res: Response) => {
        try {
            const posting = await this.companyPostingsService.createPosting(req.body);
            res.status(201).json(posting);
        } catch (error) {
            if (error instanceof Error && error.message === 'Company not found') {
                res.status(400).json({ error: 'Company not found' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    };
}