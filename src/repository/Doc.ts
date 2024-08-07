import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './User.js'



@Entity('docs')
export class Doc {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: 'varchar', default: '' })
	label: string;

	@Column({ type: 'json', nullable: true })
	children: any;  // Utilizziamo 'any' per rappresentare un JSON generico

	@ManyToOne(() => User, user => user.docs, { nullable: true, onDelete: 'CASCADE' })
	user: Relation<User>;
}



// const repo: any = {
// 	name: "nodes",
// 	class: "typeorm/repo",
// 	model: {
// 		name: "nodes",
// 		columns: {
// 			id: { type: Number, primary: true, generated: true },
// 			label: { type: String, default: "" },
// 		},
// 		// https://typeorm.delightful.studio/interfaces/_entity_schema_entityschemarelationoptions_.entityschemarelationoptions.html
// 		relations: {
// 			parent: {
// 				type: "many-to-one",
// 				target: "nodes",
// 				nullable: true,
// 				onDelete: "CASCADE",
// 			},
// 			user: {
// 				type: "many-to-one",
// 				target: "users",
// 				nullable: true,
// 				onDelete: "CASCADE",
// 			}
// 		}
// 	}
// }
// export default repo
