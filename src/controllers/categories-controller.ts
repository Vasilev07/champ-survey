import { ICategoryData } from "../interfaces/category-interface";
import { CategoriesService } from "../services/categories-service";

export class CategoriesController {
    private categoriesService: CategoriesService;

    constructor(){
        this.categoriesService = new CategoriesService();
    }
    public async createCategory(categoryName: ICategoryData): Promise<void> {
        await this.categoriesService.createCategory(categoryName);
    }
    public async getAllCategories(): Promise<ICategoryData[]> {
        return await this.categoriesService.getAllCategories();
    }

    public async getAllUserCategories(): Promise<any> {
        return await this.categoriesService.getAllUserCategories();
    }
}