/**
 * Created by meep_sitl on 26/01/15.
 */
define([
    "opening-hours"
], function (openingHours) {

    describe("Opening-hours module", function () {
        it("should be an object", function () {
            expect(typeof openingHours).toBe("object");
        });
    });
});