import { Request, Response } from 'express';
import { CompanyPostingsService } from '../services/company-postings.service';

interface CreatePostingRequest {
    companyName: string;
    freight: {
        weightPounds: number;
        equipmentType: string;
        fullPartial: string;
        lengthFeet: number;
    };
}

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
            const postingData = req.body as CreatePostingRequest;

            // Validate required fields
            if (!postingData.companyName) {
                return res.status(400).json({ error: 'companyName is required' });
            }

            if (!postingData.freight) {
                return res.status(400).json({ error: 'freight details are required' });
            }

            const { weightPounds, equipmentType, fullPartial, lengthFeet } = postingData.freight;

            if (!weightPounds) {
                return res.status(400).json({ error: 'freight.weightPounds is required' });
            }
            if (!equipmentType) {
                return res.status(400).json({ error: 'freight.equipmentType is required' });
            }
            if (!fullPartial) {
                return res.status(400).json({ error: 'freight.fullPartial is required' });
            }
            if (!lengthFeet) {
                return res.status(400).json({ error: 'freight.lengthFeet is required' });
            }

            const posting = await this.companyPostingsService.createPosting(postingData);
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