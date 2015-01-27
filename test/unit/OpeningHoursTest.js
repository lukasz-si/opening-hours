/**
 * Created by meep_sitl on 26/01/15.
 */
define([
    "js/OpeningHours"
], function (OpeningHours) {

    describe("Opening-hours module", function () {
        it("should be an object", function () {
            expect(typeof OpeningHours).toBe("function");
        });
    });
});