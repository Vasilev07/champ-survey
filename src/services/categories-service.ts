import { isNil } from "lodash";
import { DB } from "../controllers/db-controller";
import { ICategoryData } from "../interfaces/category-interface";

export class CategoriesService {

    public async createCategory(categoryName: ICategoryData): Promise<void> {
        const isCategoryNameTaken = !isNil(await this.getCategoryByName(categoryName));
        const categoryToSave = new DB.Models.Category(categoryName);

        if (categoryName.name === '') {
            throw new Error('Category name must not be empty');
        }

        if (isCategoryNameTaken) {
            throw new Error('Such category already esists');
        }

        await categoryToSave.save((err) => {
            if (err) {
                throw new Error(err);
            }
        });
    }
    
    public async getAllCategories(): Promise<ICategoryData[]> {
        return await DB.Models.Category.find({ });
    }

    public async getCategoryByName(categoryName: ICategoryData): Promise<ICategoryData | null> {
        return await DB.Models.Category.findOne(categoryName);
    }

    public async getCategoryById(categoryId: string): Promise<ICategoryData | null> {
        return await DB.Models.Category.findOne({ _id: categoryId });
    }
}