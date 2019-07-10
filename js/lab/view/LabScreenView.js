// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Lab' screen.
 *
 * Lab has a polar and a cartesian graph. Scene nodes are created to represent these graphs respectively.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );

  class LabScreenView extends VectorAdditionScreenView {
    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( labModel, tandem ) {

      assert && assert( labModel instanceof LabModel, `invalid labModel: ${labModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );


      //----------------------------------------------------------------------------------------
      // Create the scenes for the polar and cartesian scenes.

      const polarSceneNode = new SceneNode( labModel.polarGraph,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty );

      const cartesianSceneNode = new SceneNode( labModel.cartesianGraph,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty );

      super( labModel, [ polarSceneNode, cartesianSceneNode ], tandem );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel,
        labModel.polarGraph,
        labModel.polarGraph.vectorSetGroup1,
        labModel.polarGraph.vectorSetGroup2,
        polarSceneNode.vectorContainer,
        this ) );

      cartesianSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel,
        labModel.cartesianGraph,
        labModel.cartesianGraph.vectorSetGroup1,
        labModel.cartesianGraph.vectorSetGroup2,
        cartesianSceneNode.vectorContainer,
        this ) );


      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and explore2D scene is never disposed.
      labModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );


      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( labModel.coordinateSnapModeProperty ) );

      //----------------------------------------------------------------------------------------
      // Create the Graph Control panel

      const labGraphControlPanel = new LabGraphControlPanel( labModel,
        labModel.cartesianGraph.vectorSetGroup1,
        labModel.cartesianGraph.vectorSetGroup2,
        labModel.polarGraph.vectorSetGroup1,
        labModel.polarGraph.vectorSetGroup2, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( labGraphControlPanel );
    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );