import { CompanyDB } from '../mocks/company.db';
import axios from 'axios';

interface Posting {
  companyId: string;
  freight: {
    weightPounds: number;
    equipmentType: string;
    fullPartial: string;
    lengthFeet: number;
  };
}

interface PostingResponse {
  companyName: string;
  freight: {
    weightPounds: number;
    equipmentType: string;
    fullPartial: string;
    lengthFeet: number;
  };
}

export class CompanyPostingsService {
  constructor(private readonly companyDB: CompanyDB) {}

  async getCompanyPostings(equipmentType?: string, fullPartial?: string): Promise<PostingResponse[]> {
    try {
      const response = await axios.get('http://localhost:3000/postings');
      const postings = response.data as Posting[];

      let filteredPostings = postings;
      if (equipmentType) {
        filteredPostings = filteredPostings.filter(
          (posting) => posting.freight.equipmentType === equipmentType
        );
      }
      if (fullPartial) {
        filteredPostings = filteredPostings.filter(
          (posting) => posting.freight.fullPartial === fullPartial
        );
      }

      return filteredPostings
        .map((posting) => {
          const company = this.companyDB.getCompanyById(posting.companyId);
          if (!company) {
            return null;
          }
          
          return {
            companyName: company.name,
            freight: {
              weightPounds: posting.freight.weightPounds,
              equipmentType: posting.freight.equipmentType,
              fullPartial: posting.freight.fullPartial,
              lengthFeet: posting.freight.lengthFeet
            }
          };
        })
        .filter((posting): posting is PostingResponse => posting !== null);
    } catch (error) {
      throw new Error('Failed to fetch postings');
    }
  }

  async createPosting(postingData: any) {
    try {
      // Find company ID by name
      const companies = this.companyDB.getCompanyCompanyCollection();
      const company = companies.findOne({ name: postingData.companyName });
      
      if (!company) {
        throw new Error('Company not found');
      }

      const posting = {
        companyId: company.id,
        freight: {
          weightPounds: postingData.freight.weightPounds,
          equipmentType: postingData.freight.equipmentType,
          fullPartial: postingData.freight.fullPartial,
          lengthFeet: postingData.freight.lengthFeet
        }
      };

      const response = await axios.post('http://localhost:3000/postings', posting);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create posting');
    }
  }
}