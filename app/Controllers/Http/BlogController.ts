import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Post from "App/Models/Post";
import UpdatePostValidator from "App/Validators/UpdatePostValidator";

export default class BlogController {
  async index(ctx: HttpContextContract) {
    const page = ctx.request.input("page", 1);
    const posts = await Database.from(Post.table).paginate(page, 2);
    return ctx.view.render("blog/index", { posts });
  }

  async detail(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    return ctx.view.render("blog/detail", { post });
  }

  async create({ view }: HttpContextContract) {
    const post = new Post();
    return view.render("blog/create", { post });
  }

  async save(ctx: HttpContextContract) {
    await this.handle(ctx);
    ctx.session.flash({ success: "L'article a bien été créé" });
    return ctx.response.redirect().toRoute("home");
  }

  async update(ctx: HttpContextContract) {
    await this.handle(ctx);
    ctx.session.flash({ success: "L'article a bien été sauvegardé" });
    return ctx.response.redirect().toRoute("home");
  }

  async delete(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    await post.delete();
    ctx.session.flash({ success: "L'article a bien été supprimé" });
    return ctx.response.redirect().toRoute("home");
  }

  private async handle(ctx: HttpContextContract) {
    const post = ctx.params.id
      ? await Post.findOrFail(ctx.params.id)
      : new Post();
    const data = await ctx.request.validate(UpdatePostValidator);
    post.merge({ ...data, online: data.online || false }).save();
  }
}
