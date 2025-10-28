// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVectorSet is a specialization of VectorSet for the 'Equations' screen.  It adds:
 *
 *  - a set of vectors that are permanently on the graph and not disposable
 *  - an EquationsResultantVector
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorSet, { VectorSetOptions } from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsResultantVector from './EquationsResultantVector.js';
import EquationsVector from './EquationsVector.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Vector from '../../common/model/Vector.js';
import Graph from '../../common/model/Graph.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { EquationType } from './EquationType.js';
import BaseVector from '../../common/model/BaseVector.js';
import ResultantVector from '../../common/model/ResultantVector.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// Describes a non-resultant vector for the Equations screen.
export type EquationsVectorDescription = {
  symbolProperty: TReadOnlyProperty<string>; // symbol for the vector used in the user interface
  tandemNameSymbol: string; // symbol for the vector used in tandem names
  vectorTailPosition: Vector2; // tail position of the main vector
  baseVectorTailPosition: Vector2; // tail position of the base vector
  baseVectorXYComponents: Vector2; // xy-components of the base vector
};

type SelfOptions = EmptySelfOptions;

type EquationsVectorSetOptions = SelfOptions & StrictOmit<VectorSetOptions<EquationsVector>, 'createAllVectors'>;

export default class EquationsVectorSet extends VectorSet<EquationsVector> {

  // Symbols that appear in the equations on the radio buttons in EquationTypeRadioButtonGroup.
  public readonly equationSymbolProperties: TReadOnlyProperty<string>[];

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      equationTypeProperty: TReadOnlyProperty<EquationType>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorDescriptions: EquationsVectorDescription[],
                      resultantSymbolProperty: TReadOnlyProperty<string>,
                      resultantTandemNameSymbol: string,
                      providedOptions: EquationsVectorSetOptions ) {

    // Creates the complete set of non-resultant vectors for the vector set.
    const createAllVectors = ( vectorSet: VectorSet<EquationsVector> ): EquationsVector[] =>
      vectorDescriptions.map( vectorDescription => new EquationsVector(
        vectorDescription.vectorTailPosition,
        vectorDescription.baseVectorTailPosition,
        vectorDescription.baseVectorXYComponents,
        vectorSet,
        graph,
        selectedVectorProperty,
        componentVectorStyleProperty, {
          symbolProperty: vectorDescription.symbolProperty,
          coordinateSnapMode: providedOptions.coordinateSnapMode,
          vectorColorPalette: vectorSet.vectorColorPalette,
          tandemNameSymbol: vectorDescription.tandemNameSymbol,
          tandem: providedOptions.tandem.createTandem( `${vectorDescription.tandemNameSymbol}Vector` ),
          baseVectorTandem: providedOptions.tandem.createTandem( `${vectorDescription.tandemNameSymbol}BaseVector` )
        } ) );

    // Creates the resultant vector.
    const createResultantVector = ( tailPosition: Vector2,
                                    vectorSet: VectorSet<EquationsVector>,
                                    symbolProperty: TReadOnlyProperty<string>,
                                    tandemNameSymbol: string,
                                    tandem: Tandem ): ResultantVector =>
      new EquationsResultantVector( tailPosition, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, equationTypeProperty, {
        symbolProperty: symbolProperty,
        coordinateSnapMode: providedOptions.coordinateSnapMode,
        vectorColorPalette: providedOptions.vectorColorPalette,
        tandemNameSymbol: tandemNameSymbol,
        tandem: tandem
      } );

    const options = optionize<EquationsVectorSetOptions, SelfOptions, VectorSetOptions<EquationsVector>>()( {

      // VectorSetOptions
      createAllVectors: createAllVectors,
      createResultantVector: createResultantVector,
      resultantTailPosition: new Vector2( 25, 5 ),
      resultantProjectionXOffset: 0.5,
      resultantProjectionYOffset: 0.5,
      resultantSymbolProperty: resultantSymbolProperty,
      resultantTandemNameSymbol: resultantTandemNameSymbol,
      activeVectorsInstrumented: false // All vectors are always on the graph in the Equations screen.
    }, providedOptions );

    super( graph, selectedVectorProperty, componentVectorStyleProperty, options );

    // All vectors are always active in the Equations screen.
    this.allVectors.forEach( vector => this.activeVectors.push( vector ) );

    // All non-resultant vectors appear in the equations.
    this.equationSymbolProperties = this.allVectors.map( vector => vector.symbolProperty );

    // The resultant vector symbol ('c' or 'f') also appears in the equations, so add it.
    this.equationSymbolProperties.push( this.resultantVector.symbolProperty );

    this.activeVectors.lengthProperty.lazyLink( () => {
      throw new Error( 'Active vectors cannot be added or removed after startup in the Equations screen.' );
    } );
  }

  public override reset(): void {
    this.allVectors.forEach( vector => vector.reset() );
    // Do not call super.reset. The default behavior is to erase all vectors - that is, remove them from this.activeVectors,
    // returning them to the toolbox. In the Equations screen, there is no toolbox, and all vectors are always active.
  }

  /**
   * Gets all base vectors.
   */
  public getBaseVectors(): BaseVector[] {
    return this.allVectors.map( vector => vector.baseVector );
  }
}

vectorAddition.register( 'EquationsVectorSet', EquationsVectorSet );