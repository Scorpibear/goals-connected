const goalFunc = require("./index");
const Generator = require("../services/generator");

const debugMode = false;

describe("/goal", () => {
  let context;
  let req;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    context = { bindings: {}, log: debugMode ? console.log : () => {} };
    req = { query: {} };
  });

  describe("DELETE /goal", () => {
    it("removes goals in context.bindings.outGoals", async () => {
      const inputGoals = {
        goals: [
          { id: "1", title: "goal1" },
          { id: "2", title: "goal2" },
        ],
      };
      req.query.id = "1";
      req.method = "DELETE";

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [{ id: "2", title: "goal2" }],
      });
    });
    it("removes subgoal", async () => {
      const inputGoals = {
        goals: [
          {
            id: "1",
            title: "goal1",
            children: [{ id: "1-1", title: "goal2" }],
          },
        ],
      };
      req.query.id = "1-1";
      req.method = "DELETE";

      await goalFunc(context, req, inputGoals);

      expect(context.res.status).toEqual(200);
      expect(context.bindings.outGoals).toEqual({
        goals: [{ id: "1", title: "goal1", children: [] }],
      });
    });
  });

  describe("POST /goal", () => {
    it("generated unique goal id if it was not provided", async () => {
      jest.spyOn(Generator, "getNewId").mockReturnValue("generatedID");
      const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
      req = {
        method: "POST",
        body: { title: "goal2", parentId: "1" },
      };

      await goalFunc(context, req, inputGoals);
      expect(JSON.parse(context.res.body)).toEqual({
        id: "generatedID",
        title: "goal2",
      });
      expect(context.bindings.outGoals).toEqual({
        goals: [
          {
            id: "1",
            title: "goal1",
            children: [{ id: "generatedID", title: "goal2" }],
          },
        ],
      });
    });
    it("sets parent tags if they were not provided", async () => {
      const inputGoals = {
        goals: [{ id: "1", title: "goal1", tags: ["tag1", "tag2"] }],
      };
      req.method = "POST";
      req.body = { title: "goal2", parentId: "1" };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [
          {
            id: "1",
            title: "goal1",
            tags: ["tag1", "tag2"],
            children: [
              { id: expect.anything(), title: "goal2", tags: ["tag1", "tag2"] },
            ],
          },
        ],
      });
    });
    it("gives unique goal id even if it was provided", async () => {});
  });

  describe("PUT /goal", () => {
    it("sets parent tags if they were not provided", async () => {
      const inputGoals = {
        goals: [
          {
            id: "1",
            title: "goal1",
            tags: ["tag1", "tag2"],
            children: [{ id: "1.1", title: "goal2" }],
          },
        ],
      };
      req.query.id = "1.1";
      req.method = "PUT";
      req.body = { title: "updated" };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [
          {
            id: "1",
            title: "goal1",
            tags: ["tag1", "tag2"],
            children: [{ id: "1.1", title: "updated", tags: ["tag1", "tag2"] }],
          },
        ],
      });
    });
    it("sets quarters parent targetDate if the updated goal targetDate was not provided", async () => {
      jest.setSystemTime(Date.parse("2024-07-01"));
      const inputGoals = {
        goals: [
          {
            id: "1",
            title: "goal1",
            targetDate: "2024-07-31",
            children: [{ id: "1.1", title: "goal2" }],
          },
        ],
      };
      req.query.id = "1.1";
      req.method = "PUT";
      req.body = { title: "updated" };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [
          {
            id: "1",
            title: "goal1",
            targetDate: "2024-07-31",
            children: [
              { id: "1.1", title: "updated", targetDate: "2024-07-08" },
            ],
          },
        ],
      });
    });
    it("updates title", async () => {
      const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
      req.query.id = "1";
      req.method = "PUT";
      req.body = { title: "updated" };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [{ id: "1", title: "updated" }],
      });
    });
    it("ignores random properties", async () => {
      const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
      req.query.id = "1";
      req.method = "PUT";
      req.body = {
        title: "updated",
        _vts: "something",
        debugData: "something very useful (not)",
      };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [{ id: "1", title: "updated" }],
      });
    });
    it("updates type", async () => {
      const inputGoals = { goals: [{ id: "1", title: "goal1", type: 1 }] };
      req.query.id = "1";
      req.method = "PUT";
      req.body = {
        title: "goal1",
        type: 0,
      };

      await goalFunc(context, req, inputGoals);

      expect(context.bindings.outGoals).toEqual({
        goals: [{ id: "1", title: "goal1", type: 0 }],
      });
    });
  });

  describe("PATCH /goal?id=${id}", () => {
    describe("moveUp", () => {
      it("moves the goal one position up in the children list", async () => {
        const inputGoals = {
          goals: [
            {
              id: "1",
              title: "goal1",
              children: [
                { id: "1.1", title: "goal1.1" },
                { id: "1.2", title: "goal1.2" },
              ],
            },
          ],
        };
        req.query.id = "1.2";
        req.query.action = "moveUp";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [
            {
              id: "1",
              title: "goal1",
              children: [
                { id: "1.2", title: "goal1.2" },
                { id: "1.1", title: "goal1.1" },
              ],
            },
          ],
        });
      });
      it("returns 400 status if only one goal on this level", async () => {
        const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
        req.query.id = "1";
        req.query.action = "moveUp";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.res.status).toBe(400);
      });
    });
    describe("levelUp", () => {
      it("promotes the goal to the parent level", async () => {
        const inputGoals = {
          goals: [
            {
              id: "1",
              title: "goal1",
              children: [{ id: "2", title: "goal2" }],
            },
          ],
        };
        req.query.id = "2";
        req.query.action = "levelUp";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [
            { id: "1", title: "goal1" },
            { id: "2", title: "goal2" },
          ],
        });
      });
      it("returns 400 status if no upper level", async () => {
        const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
        req = { method: "PATCH", query: { id: "1", action: "levelUp" } };

        await goalFunc(context, req, inputGoals);

        expect(context.res.status).toBe(400);
      });
      it("moves the goal just after the parent", async () => {
        const inputGoals = { goals: [{ id: "p1" }, {id: "p2", children: [{id: "theGoal"}]}, {id: "p3"}] };
        req = { method: "PATCH", query: { id: "theGoal", action: "levelUp" } };

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals.goals).toEqual([{ id: "p1" }, {id: "p2"}, {id: "theGoal"}, {id: "p3"}]);
      })
    });
    describe("levelDown", () => {
      it("moves the goal to the childrens of the previous goal", async () => {
        const inputGoals = {
          goals: [
            { id: "1", title: "goal1" },
            { id: "2", title: "goal2" },
          ],
        };
        req.query.id = "2";
        req.query.action = "levelDown";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [
            {
              id: "1",
              title: "goal1",
              children: [{ id: "2", title: "goal2" }],
            },
          ],
        });
      });
      it("moves the goal to the end of existent children list of the previous goal", async () => {
        const inputGoals = {
          goals: [
            {
              id: "root1",
              children: [
                { id: "goal1", children: [{ id: "child1" }] },
                { id: "goal2" },
              ],
            },
          ],
        };
        req.query.id = "goal2";
        req.query.action = "levelDown";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [
            {
              id: "root1",
              children: [
                { id: "goal1", children: [{ id: "child1" }, { id: "goal2" }] },
              ],
            },
          ],
        });
      });
    });
    describe("complete", () => {
      it("marks the goal as completed", async () => {
        const inputGoals = { goals: [{ id: "1", title: "goal1" }] };
        req.query.id = "1";
        req.query.action = "complete";
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [{ id: "1", title: "goal1", completed: true }],
        });
      });
      it("marks the goal as uncompleted", async () => {
        const inputGoals = { goals: [{ id: "1", title:  "goal1", completed: true }] }; 
        req.query.id = "1";
        req.query.action = "complete";
        req.query.value = false;
        req.method = "PATCH";

        await goalFunc(context, req, inputGoals);

        expect(context.bindings.outGoals).toEqual({
          goals: [{ id: "1", title: "goal1", completed: false }],
        });
      });
    });
  });
});
