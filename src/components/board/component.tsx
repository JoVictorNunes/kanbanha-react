import React from "react";
import Layout from "../layout/component";
import TaskForm from "../task-form/component";
import Card from "../card/component";
import Members from "../members/component";
import MemberForm from "../member-form/component";
import Active from "../active/component";
import Finished from "../finished/component";
import Ongoing from "../ongoing/component";

const Board: React.FC = () => {
  return (
    <Layout>
      <Card title="Nova tarefa">
        <TaskForm />
      </Card>
      <Card title="Cadastrar membro">
        <MemberForm />
      </Card>
      <Card title="Membros">
        <Members />
      </Card>
      <Card title="Ativas">
        <Active />
      </Card>
      <Card title="Em desenvolvimento">
        <Ongoing />
      </Card>
      <Card title="Finalizadas">
        <Finished />
      </Card>
    </Layout>
  );
};

export default Board;
